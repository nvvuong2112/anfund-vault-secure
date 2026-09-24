import { useEffect, useState } from "react";

/**
 * `false` lúc render trên server và lần hydrate đầu, `true` từ sau đó.
 * Dùng cho thuộc tính suy ra từ giờ hiện tại (vd. độ rộng thanh tiến trình):
 * server và client lệch nhau vài trăm mili giây là đủ làm React báo lệch hydration.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
