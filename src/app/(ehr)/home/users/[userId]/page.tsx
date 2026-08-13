import { redirect } from "next/navigation";

type Props = {
  params: { userId: string };
};

/** Legacy path — Practice Fusion uses /settings/user/:id */
export default function LegacyHomeUserProfileRedirect({ params }: Props) {
  redirect(`/settings/user/${params.userId}`);
}
