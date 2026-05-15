import Image from "next/image";

function Logo({ size = 24 }: { size?: number }) {
  return (
    <>
      <Image
        className="dark:hidden"
        src="/logo_black.svg"
        alt="logo"
        width={size}
        height={size}
        priority
      />
      <Image
        className="hidden dark:block"
        src="/logo_white.svg"
        alt="logo"
        width={size}
        height={size}
        priority
      />
    </>
  );
}
export default Logo;
