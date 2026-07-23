// app/buttons/page.tsx
import {
  AllWhiteButton,
  BigFadedButton,
  BigGradientDarkButton,
  BigGradientLightButton,
  BigNormalGreenButton,
  GreenButton,
  LightGreenButton,
  RedBgButton,
  WhiteBgButton,
  WhiteTxtBorderButton,
} from "@/components/button";

export default function ButtonsPage() {
  return (
    <div className="min-h-screen bg-[#0d1f16] p-10">
      <h1 className="mb-8 text-2xl font-semibold text-white">Button Library</h1>
      <div className="flex flex-wrap items-center gap-6">
        <AllWhiteButton>Get a Quote</AllWhiteButton>
        <BigFadedButton>Log in/Sign up</BigFadedButton>
        <BigGradientDarkButton>Log in/Sign up</BigGradientDarkButton>
        <BigGradientLightButton>Log in/Sign up</BigGradientLightButton>
        <BigNormalGreenButton>Log in/Sign up</BigNormalGreenButton>
        <GreenButton>Get a Quote</GreenButton>
        <LightGreenButton>Get a Quote</LightGreenButton>
        <RedBgButton>Log in/Sign up</RedBgButton>
        <WhiteBgButton>Get a Quote</WhiteBgButton>
        <WhiteTxtBorderButton>Get a Quote</WhiteTxtBorderButton>
      </div>
    </div>
  );
}
