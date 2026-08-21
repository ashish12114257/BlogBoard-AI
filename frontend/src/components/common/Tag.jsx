export default function Tag({ className = '', children, ...props }) {
  return (
    <span className={`tag ${className}`} {...props}>
      {children}
    </span>
  );
}