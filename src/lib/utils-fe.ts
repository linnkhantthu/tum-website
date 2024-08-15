import { FlashMessage } from "./models";
/**
 * Toast on Delete
 * @param toastId
 */
export const toastOnDelete = (
  toastId: string,
  toasts: FlashMessage[],
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>
) => {
  const localToasts: FlashMessage[] | null = JSON.parse(
    localStorage.getItem("toasts")!
  );
  const filteredLocalToasts = localToasts?.filter(
    (toast) => toast.id !== toastId
  );

  localStorage.setItem(
    "toasts",
    JSON.stringify(filteredLocalToasts ? filteredLocalToasts : [])
  );

  const filteredToasts = toasts.filter((toast) => toast.id !== toastId);
  setToasts(filteredToasts);
  return true;
};

export function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
