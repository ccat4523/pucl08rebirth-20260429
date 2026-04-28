      {/* ===== HERO IMAGE SECTION ===== */}
      <section
        id="hero-image"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.6) 0%, rgba(232, 223, 210, 0.8) 100%)",
        }}
      >
        <div
          ref={infoSection.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            infoSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* 照片格 - 只在有圖片時顯示 */}
          {editingHeroImage ? (
            // 編輯模式
            <div
              className="p-6 rounded-sm"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "2px solid #8b7355",
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: "#5a4a3a" }}>
                編輯宣傳照片
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#5a4a3a" }}>
                    照片 URL
                  </label>
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="輸入照片 URL..."
                    className="w-full px-3 py-2 border rounded"
                    style={{ borderColor: "#8b7355" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#5a4a3a" }}>
                    上傳照片檔案
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setEditingHeroImage(false);
                      setHeroImageFile(null);
                    }}
                    className="px-4 py-2 rounded"
                    style={{
                      background: "#e8dfd2",
                      color: "#5a4a3a",
                      border: "1px solid #8b7355",
                    }}
                  >
                    取消
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        let finalUrl = heroImage;
                        if (heroImageFile) {
                          setUploadingHeroImage(true);
                          const formData = new FormData();
                          formData.append("file", heroImageFile);
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          finalUrl = data.url;
                          setUploadingHeroImage(false);
                        }
                        await updateHeroImageMutation.mutateAsync({
                          imageUrl: finalUrl,
                        });
                        setHeroImage(finalUrl);
                        setEditingHeroImage(false);
                        setHeroImageFile(null);
                      } catch (error) {
                        console.error("保存失敗", error);
                        setUploadingHeroImage(false);
                      }
                    }}
                    disabled={updateHeroImageMutation.isPending || uploadingHeroImage}
                    className="px-4 py-2 rounded text-white"
                    style={{
                      background: "#d4a574",
                    }}
                  >
                    {updateHeroImageMutation.isPending || uploadingHeroImage ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>
            </div>
          ) : heroImage ? (
            // 顯示模式
            <div
              className="rounded-sm overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "2px solid #8b7355",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="relative">
                <img
                  src={heroImage}
                  alt="展覽宣傳圖"
                  className="w-full h-auto object-cover"
                  style={{
                    maxHeight: "400px",
                    display: "block",
                  }}
                />
                {isAuthenticated && user?.role === "admin" && (
                  <button
                    onClick={() => setEditingHeroImage(true)}
                    className="absolute top-2 right-2 px-3 py-1 rounded text-sm"
                    style={{
                      background: "#d4a574",
                      color: "white",
                    }}
                  >
                    編輯
                  </button>
                )}
              </div>
            </div>
          ) : isAuthenticated && user?.role === "admin" ? (
            // 空置模式（管理員可以添加）
            <div
              className="p-6 rounded-sm text-center cursor-pointer"
              onClick={() => setEditingHeroImage(true)}
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "2px dashed #8b7355",
              }}
            >
              <p style={{ color: "#8b7355" }}>點擊添加宣傳照片</p>
            </div>
          ) : null}
        </div>
      </section>
