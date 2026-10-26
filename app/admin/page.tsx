import { redirect } from "next/navigation";

/** 관리 화면은 문제 관리부터 연다 (관리자 확인은 각 페이지가 한다) */
export default function AdminPage() {
  redirect("/admin/questions");
}
