import Image from "next/image";

function Logo() {
  return (
    <>
      <Image
        className="dark:hidden"
        src="/logo_black.svg"
        alt="logo"
        width={24}
        height={24}
        priority
      />
      <Image
        className="hidden dark:block"
        src="/logo_white.svg"
        alt="logo"
        width={24}
        height={24}
        priority
      />
    </>
  );
}
export default Logo;
