import { RequireLogin } from "@/features/login-gate/require-login";

export default function Home() {
  return (
    <RequireLogin>
      <div className="flex flex-1 items-center justify-center p-8">
        <h1 className="text-2xl font-semibold">AWS 기출문제</h1>
      </div>
    </RequireLogin>
  );
}
