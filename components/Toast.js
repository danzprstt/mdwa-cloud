export default function Toast({ msg, type = 'ok' }) {
  const icon = type === 'ok' ? '✅' : type === 'err' ? '❌' : 'ℹ';
  return (
    <div className={`toast ${type}`}>
      {icon} {msg}
    </div>
  );
}
