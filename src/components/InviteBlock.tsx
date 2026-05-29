import { useEffect, useState } from "react";
import { Copy, Share2, MessageSquare, Mail } from "lucide-react";
import { toast } from "sonner";
import { SmallCaps } from "@/components/ui-lectio/SmallCaps";
import { useAppState } from "@/state/store";
import {
  buildInviteLink,
  countInviteClicks,
  inviteMessage,
} from "@/lib/invites";

interface Props {
  /** If the user searched an email and we found nobody, prefill the mailto. */
  prefilledEmail?: string;
  /** Optional eyebrow override; defaults to "Invite to Lectio". */
  eyebrow?: string;
}

export function InviteBlock({ prefilledEmail, eyebrow = "Invite to Lectio" }: Props) {
  const { userId, user } = useAppState();
  const [clicks, setClicks] = useState<number>(0);

  const link = userId
    ? buildInviteLink({ username: user.username, userId })
    : { url: "https://lectio.live", slug: "" };
  const message = inviteMessage(user.name, link.url);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    countInviteClicks(userId)
      .then((n) => alive && setClicks(n))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [userId]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Long-press to copy manually.");
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Lectio",
          text: message,
          url: link.url,
        });
        return;
      } catch {
        // user cancelled — fall through to copy
        return;
      }
    }
    await copy();
  };

  const canNativeShare =
    typeof navigator !== "undefined" && "share" in navigator;

  const smsHref = `sms:${prefilledEmail ? "" : ""}?&body=${encodeURIComponent(message)}`;
  const mailHref = `mailto:${prefilledEmail ?? ""}?subject=${encodeURIComponent(
    "A quiet way to read the Bible",
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div>
      <SmallCaps tone="gold">{eyebrow}</SmallCaps>

      {/* Link preview */}
      <div
        className="mt-3 flex items-center gap-2 rounded-[12px] px-3 py-3"
        style={{
          background: "var(--color-paper-soft)",
          border: "1px solid var(--color-rule)",
        }}
      >
        <span
          className="flex-1 truncate font-ui tabular text-[color:var(--color-ink)]"
          style={{ fontSize: 12 }}
        >
          {link.url}
        </span>
        <button
          onClick={copy}
          aria-label="Copy link"
          className="p-1.5 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
        >
          <Copy size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {canNativeShare && (
          <InviteAction icon={<Share2 size={16} strokeWidth={1.5} />} label="Share" onClick={share} />
        )}
        <InviteAction
          icon={<MessageSquare size={16} strokeWidth={1.5} />}
          label="Text"
          href={smsHref}
        />
        <InviteAction
          icon={<Mail size={16} strokeWidth={1.5} />}
          label={prefilledEmail ? "Email Them" : "Email"}
          href={mailHref}
          highlight={!!prefilledEmail}
        />
        {!canNativeShare && (
          <InviteAction icon={<Copy size={16} strokeWidth={1.5} />} label="Copy" onClick={copy} />
        )}
      </div>

      {clicks > 0 && (
        <p
          className="mt-4 font-body italic text-[color:var(--color-ink-muted)]"
          style={{ fontSize: 13 }}
        >
          {clicks} {clicks === 1 ? "person has" : "people have"} opened your link.
        </p>
      )}
    </div>
  );
}

function InviteAction({
  icon,
  label,
  onClick,
  href,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  highlight?: boolean;
}) {
  const className =
    "flex flex-col items-center justify-center gap-1 rounded-[12px] py-3 px-2 transition-colors";
  const style: React.CSSProperties = {
    background: highlight ? "var(--color-gold)" : "var(--color-paper-soft)",
    color: highlight ? "var(--color-paper)" : "var(--color-ink)",
    border: highlight
      ? "1px solid var(--color-gold)"
      : "1px solid var(--color-rule)",
  };
  const inner = (
    <>
      {icon}
      <span
        className="font-ui uppercase tracking-[0.14em]"
        style={{ fontSize: 10 }}
      >
        {label}
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={className} style={style}>
      {inner}
    </button>
  );
}
