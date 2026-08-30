# HTTP routes and cardinality established

使用者已建立 `http.route`、實際 URL/path 與 logical API operation 的區別，並理解 cardinality 是唯一值（metrics 則是 Attribute 組合）數量。後續 manual instrumentation 與 metrics 課程可直接要求以 route template 建模、辨識高基數值，並討論成本與敏感資料的取捨。

## Evidence

使用者在 2026-08-08 主動追問 route、完整 URL 與 cardinality 的語義，並表示已對這些延伸概念有一定程度理解，要求保存為後續可用的知識。
