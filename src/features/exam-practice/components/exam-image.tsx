type ExamImageProps = {
  src: string;
  alt: string;
};

/** 문제·보기 이미지 (public/images 또는 관리 화면에서 올린 Storage 이미지, 크기가 제각각이라 원본 비율 그대로 최대 너비만 제한) */
export function ExamImage({ src, alt }: ExamImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 크기를 모르는 정적 이미지라 next/image 대신 사용
    <img src={src} alt={alt} loading="lazy" className="h-auto max-w-full rounded-md border bg-white" />
  );
}
