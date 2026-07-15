import { OutlineButton } from "@/components/dashboard/dashboard-actions";
import { Toggle } from "@/components/dashboard/toggle";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lawn-text-primary text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="bg-lawn-bg-2 flex items-center gap-6 rounded-xl p-6 drop-shadow-[0px_4px_8px_rgba(74,74,74,0.14)] lg:p-8">
      <div className="min-w-0 flex-1">
        <p className="text-lawn-text-primary text-lg font-semibold tracking-tight">
          {title}
        </p>
        <p className="text-lawn-text-secondary text-base font-medium tracking-tight">
          {description}
        </p>
      </div>
      {control}
    </div>
  );
}

export function SettingsContent() {
  return (
    <>
      <SettingsSection title="Notifications">
        <SettingRow
          title="Email reminders"
          description="Get a note before each schedule visit"
          control={<Toggle defaultOn label="Email reminders" />}
        />
        <SettingRow
          title={'SMS "on the way" alerts'}
          description="Text me when my pro is en route"
          control={<Toggle defaultOn label="SMS on the way alerts" />}
        />
        <SettingRow
          title="Promotions & offers"
          description="Occasional deals and seasonal tips"
          control={<Toggle label="Promotions and offers" />}
        />
      </SettingsSection>

      <SettingsSection title="Plan">
        <SettingRow
          title="Bi-weekly · Lawn Mowing"
          description="$66 per visit · next on Jun 30"
          control={<OutlineButton>Pause plan</OutlineButton>}
        />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingRow
          title="Password"
          description="Last changed 3 months ago"
          control={<OutlineButton>Change password</OutlineButton>}
        />
        <div className="flex items-center gap-6 rounded-xl border border-[#e02929] bg-[#fee2e2] p-6 lg:p-8">
          <div className="min-w-0 flex-1 text-[#e02929]">
            <p className="text-lg font-semibold tracking-tight">Delete account</p>
            <p className="text-base font-medium tracking-tight">
              Permanently remove your account and data
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl bg-[#e02929] px-8 py-3 text-base font-semibold tracking-tight whitespace-nowrap text-white shadow-[0px_5px_5px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </SettingsSection>
    </>
  );
}
