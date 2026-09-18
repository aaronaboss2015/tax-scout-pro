export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <>
      <img
        src="/logo-icon.png"
        alt="TaxScout"
        width={32}
        height={32}
        className={`${className} rounded-lg object-contain dark:hidden`}
      />
      <img
        src="/logo-dark-icon.png"
        alt="TaxScout"
        width={32}
        height={32}
        className={`${className} hidden rounded-lg object-contain dark:block`}
      />
    </>
  );
}
