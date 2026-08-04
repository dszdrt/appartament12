import { db } from "@/lib/db";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await db.siteSetting.findMany();
  
  // Convert array to object for easier default values
  const config: Record<string, string> = {};
  settings.forEach(s => { config[s.key] = s.value; });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Настройки сайта</h1>
      </div>

      <SettingsForm config={config} />
    </div>
  );
}
