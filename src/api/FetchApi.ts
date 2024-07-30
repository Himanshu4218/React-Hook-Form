import { FormData } from "../types";

export default async function fetchData(
  data: FormData
): Promise<{ success: boolean; data?: FormData } | { message: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject({ message: "Sever Error Please try again!" });
      } else {
        resolve({ success: true, data });
      }
    }, 1000);
  });
}
