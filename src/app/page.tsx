import BirthdayExperience from "@/components/BirthdayExperience";
import LockedExperience from "@/components/LockedExperience";
import { Suspense } from "react";
import { connection } from "next/server";
import { getUnlockTimestamp, isUnlockedAt, isValidPreviewSecret } from "@/lib/unlock";

async function ProtectedBirthday({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  await connection();
  const { preview } = await searchParams;
  const authorizedPreview = isValidPreviewSecret(preview);
  const unlockAt = getUnlockTimestamp();

  if (authorizedPreview || isUnlockedAt()) return <BirthdayExperience />;
  return <LockedExperience unlockAt={unlockAt} />;
}

export default function Home(props: PageProps<"/">) {
  return (
    <Suspense fallback={<main className="loading-screen"><span className="loader-star">✦</span><p>Preparing Ani’s surprise…</p><div className="loading-line"><i /></div></main>}>
      <ProtectedBirthday searchParams={props.searchParams} />
    </Suspense>
  );
}
