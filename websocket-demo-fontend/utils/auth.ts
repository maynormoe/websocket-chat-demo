import Cookies from "js-cookie";
export async function createCookie({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  Cookies.set(
    name,
    value,
    // path: "/",
  );
}

export async function deleteCookie(name: string) {
  return Cookies.remove(name);
}

export async function getCookie(name: string) {
  return Cookies.get(name);
}
