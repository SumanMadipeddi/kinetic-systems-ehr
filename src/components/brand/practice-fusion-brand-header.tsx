export function PracticeFusionBrandHeader() {
  return (
    <>
      <header className="flex h-[60px] items-center bg-black pl-14 pr-5">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.ico"
            alt=""
            width={36}
            height={36}
            className="h-[36px] w-[36px] shrink-0 object-contain"
          />
          <span className="text-[22px] leading-none tracking-[-0.02em]">
            <span className="font-normal text-[#00A3E0]">practice</span>
            <span className="font-semibold text-white"> fusion</span>
          </span>
        </div>
      </header>
      <div
        className="h-[3px] w-full shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #5b2d8e 0%, #5b2d8e 16%, #1e5f9e 16%, #1e5f9e 30%, #00a9e0 30%, #00a9e0 100%)",
        }}
        aria-hidden
      />
    </>
  );
}
