export function PracticeFusionBrandHeader() {
  return (
    <>
      <header className="bg-black px-5 py-[11px]">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.ico"
            alt=""
            width={26}
            height={26}
            className="h-[26px] w-[26px] shrink-0 object-contain"
          />
          <span className="text-[19px] leading-none tracking-[-0.02em]">
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
