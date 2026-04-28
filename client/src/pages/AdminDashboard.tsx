/**
 * Admin Dashboard - 蛻生畢展管理員編輯系統
 * 只有操作者可以編輯、上傳圖片和影片
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

interface WorkEditState {
  id: number;
  workNumber: number;
  title: string;
  author: string;
  image1Url?: string;
  image2Url?: string;
  videoUrl?: string;
  isLoading?: boolean;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [works, setWorks] = useState<WorkEditState[]>([]);
  const [selectedWork, setSelectedWork] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  // tRPC queries and mutations
  const worksQuery = trpc.works.list.useQuery();
  const updateWorkMutation = trpc.works.update.useMutation();

  // 檢查是否為管理員（只有 owner 可以編輯）
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (worksQuery.data) {
      setWorks(worksQuery.data as WorkEditState[]);
      setIsLoading(false);
    }
  }, [worksQuery.data]);

  const handleTitleChange = (workNumber: number, newTitle: string) => {
    setWorks(works.map(w => 
      w.workNumber === workNumber ? { ...w, title: newTitle } : w
    ));
  };

  const handleAuthorChange = (workNumber: number, newAuthor: string) => {
    setWorks(works.map(w => 
      w.workNumber === workNumber ? { ...w, author: newAuthor } : w
    ));
  };

  const handleImageUpload = async (workNumber: number, imageNumber: 1 | 2, file: File) => {
    try {
      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: true } : w
      ));

      // 上傳文件到 S3
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url, key } = await response.json();

      // 更新作品
      const work = works.find(w => w.workNumber === workNumber);
      if (work) {
        const updateData: any = {
          id: work.id,
          workNumber,
        };

        if (imageNumber === 1) {
          updateData.image1Url = url;
          updateData.image1Key = key;
        } else {
          updateData.image2Url = url;
          updateData.image2Key = key;
        }

        await updateWorkMutation.mutateAsync(updateData);

        setWorks(works.map(w => 
          w.workNumber === workNumber 
            ? { 
                ...w, 
                ...(imageNumber === 1 ? { image1Url: url } : { image2Url: url }),
                isLoading: false
              } 
            : w
        ));

        toast.success(`圖片 ${imageNumber} 上傳成功`);
      }
    } catch (error) {
      toast.error("上傳失敗");
      console.error(error);
      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: false } : w
      ));
    }
  };

  const handleVideoUpload = async (workNumber: number, file: File) => {
    try {
      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: true } : w
      ));

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url, key } = await response.json();

      const work = works.find(w => w.workNumber === workNumber);
      if (work) {
        await updateWorkMutation.mutateAsync({
          id: work.id,
          workNumber,
          videoUrl: url,
          videoKey: key,
        });

        setWorks(works.map(w => 
          w.workNumber === workNumber 
            ? { ...w, videoUrl: url, isLoading: false } 
            : w
        ));

        toast.success("影片上傳成功");
      }
    } catch (error) {
      toast.error("上傳失敗");
      console.error(error);
      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: false } : w
      ));
    }
  };

  const handleSave = async (workNumber: number) => {
    try {
      const work = works.find(w => w.workNumber === workNumber);
      if (!work) return;

      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: true } : w
      ));

      await updateWorkMutation.mutateAsync({
        id: work.id,
        workNumber,
        title: work.title,
        author: work.author,
      });

      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: false } : w
      ));

      toast.success("保存成功");
    } catch (error) {
      toast.error("保存失敗");
      console.error(error);
      setWorks(works.map(w => 
        w.workNumber === workNumber ? { ...w, isLoading: false } : w
      ));
    }
  };

  const handleRemoveImage = async (workNumber: number, imageNumber: 1 | 2) => {
    try {
      const work = works.find(w => w.workNumber === workNumber);
      if (!work) return;

      const updateData: any = {
        id: work.id,
        workNumber,
      };

      if (imageNumber === 1) {
        updateData.image1Url = "";
        updateData.image1Key = "";
      } else {
        updateData.image2Url = "";
        updateData.image2Key = "";
      }

      await updateWorkMutation.mutateAsync(updateData);

      setWorks(works.map(w => 
        w.workNumber === workNumber 
          ? { 
              ...w, 
              ...(imageNumber === 1 ? { image1Url: undefined } : { image2Url: undefined })
            } 
          : w
      ));

      toast.success("圖片已移除");
    } catch (error) {
      toast.error("移除失敗");
      console.error(error);
    }
  };

  const handleRemoveVideo = async (workNumber: number) => {
    try {
      const work = works.find(w => w.workNumber === workNumber);
      if (!work) return;

      await updateWorkMutation.mutateAsync({
        id: work.id,
        workNumber,
        videoUrl: "",
        videoKey: "",
      });

      setWorks(works.map(w => 
        w.workNumber === workNumber 
          ? { ...w, videoUrl: undefined } 
          : w
      ));

      toast.success("影片已移除");
    } catch (error) {
      toast.error("移除失敗");
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>需要登入</CardTitle>
            <CardDescription>請登入以訪問管理員編輯系統</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              只有授權的管理員可以編輯作品內容
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>無法訪問</CardTitle>
            <CardDescription>您沒有編輯權限</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              只有管理員可以編輯作品內容
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const currentWork = works.find(w => w.workNumber === selectedWork);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">蛻生畢展 - 管理員編輯系統</h1>
          <p className="text-muted-foreground">編輯 17 個組別的作品內容、上傳圖片和影片</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側：組別列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">組別列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {works.map(work => (
                    <button
                      key={work.workNumber}
                      onClick={() => setSelectedWork(work.workNumber)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedWork === work.workNumber
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="text-sm font-medium">第 {work.workNumber} 組</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {work.title || "未命名"}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：編輯表單 */}
          <div className="lg:col-span-3">
            {currentWork && (
              <Card>
                <CardHeader>
                  <CardTitle>編輯第 {currentWork.workNumber} 組</CardTitle>
                  <CardDescription>編輯作品信息、上傳圖片和影片</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">基本信息</TabsTrigger>
                      <TabsTrigger value="images">圖片</TabsTrigger>
                      <TabsTrigger value="video">影片</TabsTrigger>
                    </TabsList>

                    {/* 基本信息標籤 */}
                    <TabsContent value="info" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">作品標題</label>
                        <Input
                          value={currentWork.title}
                          onChange={(e) => handleTitleChange(currentWork.workNumber, e.target.value)}
                          placeholder="輸入作品標題"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">創作者/組別名稱</label>
                        <Input
                          value={currentWork.author}
                          onChange={(e) => handleAuthorChange(currentWork.workNumber, e.target.value)}
                          placeholder="輸入創作者或組別名稱"
                        />
                      </div>
                      <Button
                        onClick={() => handleSave(currentWork.workNumber)}
                        disabled={currentWork.isLoading}
                        className="w-full"
                      >
                        {currentWork.isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            保存中...
                          </>
                        ) : (
                          "保存信息"
                        )}
                      </Button>
                    </TabsContent>

                    {/* 圖片標籤 */}
                    <TabsContent value="images" className="space-y-4">
                      {/* 圖片 1 */}
                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium mb-3">圖片 1</label>
                        {currentWork.image1Url ? (
                          <div className="relative mb-3">
                            <img
                              src={currentWork.image1Url}
                              alt="圖片 1"
                              className="w-full h-48 object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveImage(currentWork.workNumber, 1)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="mb-3 w-full h-48 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground">未上傳圖片</span>
                          </div>
                        )}
                        <label className="block">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
                            <Upload className="h-4 w-4" />
                            上傳圖片 1
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(currentWork.workNumber, 1, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            disabled={currentWork.isLoading}
                          />
                        </label>
                      </div>

                      {/* 圖片 2 */}
                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium mb-3">圖片 2</label>
                        {currentWork.image2Url ? (
                          <div className="relative mb-3">
                            <img
                              src={currentWork.image2Url}
                              alt="圖片 2"
                              className="w-full h-48 object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveImage(currentWork.workNumber, 2)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="mb-3 w-full h-48 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground">未上傳圖片</span>
                          </div>
                        )}
                        <label className="block">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
                            <Upload className="h-4 w-4" />
                            上傳圖片 2
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(currentWork.workNumber, 2, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            disabled={currentWork.isLoading}
                          />
                        </label>
                      </div>
                    </TabsContent>

                    {/* 影片標籤 */}
                    <TabsContent value="video" className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <label className="block text-sm font-medium mb-3">影片</label>
                        {currentWork.videoUrl ? (
                          <div className="relative mb-3">
                            <video
                              src={currentWork.videoUrl}
                              controls
                              className="w-full h-48 bg-black rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveVideo(currentWork.workNumber)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="mb-3 w-full h-48 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground">未上傳影片</span>
                          </div>
                        )}
                        <label className="block">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
                            <Upload className="h-4 w-4" />
                            上傳影片
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleVideoUpload(currentWork.workNumber, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            disabled={currentWork.isLoading}
                          />
                        </label>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
