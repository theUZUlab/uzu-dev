export default function Empty({ text = "데이터가 없습니다." }: { text?: string }) {
  return <div>{text}</div>;
}
