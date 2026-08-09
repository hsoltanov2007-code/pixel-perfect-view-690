import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash, Plus, SignOut, ArrowClockwise } from "@phosphor-icons/react";
import {
  adminDeleteProduct,
  adminGetOperatorStatus,
  adminGetSettings,
  adminGetThreadMessages,
  adminListCarts,
  adminListProducts,
  adminListThreads,
  adminLogin,
  adminLogout,
  adminResolveImageUrl,
  adminSaveProduct,
  adminSaveSettings,
  adminSetOperatorOnline,
  adminUploadProductImage,
  getAdminStatus,
} from "@/lib/admin.functions";
import { formatPrice } from "@/lib/product-image";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Панель управления — 2G SHOP" },
      { name: "description", content: "Внутренняя панель управления 2G SHOP." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Панель управления — 2G SHOP" },
      { property: "og:description", content: "Внутренняя панель управления 2G SHOP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  ssr: false,
  component: AdminPage,
});

type Tab = "products" | "support" | "orders" | "settings";

function AdminPage() {
  const qc = useQueryClient();
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("products");

  const { data: status, isLoading } = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => getAdminStatus(),
  });

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await login({ data: { password } });
    if (res.ok) {
      setPassword("");
      qc.invalidateQueries();
      toast.success("Добро пожаловать");
    } else {
      toast.error(
        res.reason === "not_configured"
          ? "Пароль администратора ещё не задан"
          : "Неверный пароль"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Загрузка…
      </div>
    );
  }

  if (!status?.admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl"
        >
          <h1 className="font-display text-2xl font-semibold">Вход</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Введите пароль администратора.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
            placeholder="Пароль"
          />
          <button className="mt-4 w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold">
            Панель управления
          </h1>
          <div className="flex items-center gap-2">
            <OperatorToggle />
            <button
              onClick={async () => {
                await logout({});
                qc.invalidateQueries();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <SignOut size={14} weight="light" /> Выйти
            </button>
          </div>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["products", "Товары"],
              ["support", "Поддержка"],
              ["orders", "Заказы"],
              ["settings", "Контакты"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                tab === key
                  ? "bg-foreground text-background"
                  : "border border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "products" && <ProductsTab />}
          {tab === "support" && <SupportTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function OperatorToggle() {
  const qc = useQueryClient();
  const setOnline = useServerFn(adminSetOperatorOnline);
  const { data } = useQuery({
    queryKey: ["admin-operator"],
    queryFn: () => adminGetOperatorStatus(),
  });
  const online = data?.online ?? false;
  return (
    <button
      onClick={async () => {
        await setOnline({ data: { online: !online } });
        qc.invalidateQueries({ queryKey: ["admin-operator"] });
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs"
    >
      <span
        className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-red-400"}`}
      />
      Оператор {online ? "онлайн" : "офлайн"}
    </button>
  );
}

type ProductRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  image_key: string | null;
  perks: string[];
  badge: string | null;
  active: boolean;
  sort_order: number;
};

const emptyProduct: ProductRow = {
  id: "",
  title: "",
  description: "",
  price: 0,
  currency: "AZN",
  period: "/ month",
  image_key: "",
  perks: [],
  badge: "",
  active: true,
  sort_order: 0,
};

function ProductsTab() {
  const qc = useQueryClient();
  const save = useServerFn(adminSaveProduct);
  const del = useServerFn(adminDeleteProduct);
  const [editing, setEditing] = useState<ProductRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminListProducts(),
  });

  async function onSave(p: ProductRow) {
    try {
      await save({
        data: {
          ...(p.id ? { id: p.id } : {}),
          title: p.title,
          description: p.description ?? "",
          price: Number(p.price),
          currency: p.currency || "$",
          period: p.period || "",
          image_key: p.image_key || null,
          perks: p.perks.filter(Boolean),
          badge: p.badge || null,
          active: p.active,
          sort_order: Number(p.sort_order) || 0,
        },
      });
      setEditing(null);
      qc.invalidateQueries();
      toast.success("Сохранено");
    } catch {
      toast.error("Не удалось сохранить");
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  return (
    <div>
      <button
        onClick={() => setEditing({ ...emptyProduct })}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        <Plus size={16} weight="bold" /> Новый товар
      </button>

      <div className="mt-6 grid gap-3">
        {(data as ProductRow[] | undefined)?.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4"
          >
            <div>
              <p className="font-medium">
                {p.title}{" "}
                {!p.active && (
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                    скрыт
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(Number(p.price), p.currency)} {p.period}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing({ ...p, perks: p.perks ?? [] })}
                className="rounded-full border border-white/10 px-4 py-2 text-xs hover:bg-white/5"
              >
                Изменить
              </button>
              <button
                onClick={async () => {
                  if (!confirm(`Удалить «${p.title}»?`)) return;
                  await del({ data: { id: p.id } });
                  qc.invalidateQueries();
                }}
                className="rounded-full border border-white/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                aria-label="Удалить"
              >
                <Trash size={14} weight="light" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductForm
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}

function ProductForm({
  value,
  onSave,
  onCancel,
}: {
  value: ProductRow;
  onSave: (p: ProductRow) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductRow>(value);
  useEffect(() => setForm(value), [value]);

  const uploadImage = useServerFn(adminUploadProductImage);
  const resolveImage = useServerFn(adminResolveImageUrl);

  const [imageMode, setImageMode] = useState<"file" | "link">(
    form.image_key &&
      (form.image_key.startsWith("http") || form.image_key.startsWith("/"))
      ? "link"
      : "file"
  );
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const key = form.image_key;
    if (!key) {
      setPreviewUrl("");
      return;
    }
    if (key.startsWith("storage:")) {
      resolveImage({ data: { image_key: key } })
        .then((res) => {
          if (!cancelled) setPreviewUrl(res.url);
        })
        .catch(() => {
          if (!cancelled) setPreviewUrl("");
        });
    } else {
      setPreviewUrl(key);
    }
    return () => {
      cancelled = true;
    };
  }, [form.image_key, resolveImage]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Выберите изображение");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Файл слишком большой (макс. 2 МБ)");
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await uploadImage({ data: { filename: file.name, base64 } });
      setForm((prev) => ({ ...prev, image_key: res.image_key }));
      toast.success("Изображение загружено");
    } catch {
      toast.error("Не удалось загрузить изображение");
    } finally {
      setUploading(false);
    }
  }

  const field = "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-white/30";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[oklch(0.1_0_0)] p-6">
        <h2 className="font-display text-lg font-semibold">
          {form.id ? "Изменить товар" : "Новый товар"}
        </h2>
        <div className="mt-5 space-y-3">
          <input
            className={field}
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className={field}
            rows={3}
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              className={field}
              type="number"
              step="0.01"
              placeholder="Цена"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <input
              className={field}
              placeholder="Валюта"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
            <input
              className={field}
              placeholder="/ month"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-medium">Фото товара</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={`flex-1 rounded-full px-3 py-2 text-xs transition-colors ${
                  imageMode === "file"
                    ? "bg-foreground text-background"
                    : "border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                Загрузить файл
              </button>
              <button
                type="button"
                onClick={() => setImageMode("link")}
                className={`flex-1 rounded-full px-3 py-2 text-xs transition-colors ${
                  imageMode === "link"
                    ? "bg-foreground text-background"
                    : "border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                Ссылка на фото
              </button>
            </div>

            {imageMode === "file" ? (
              <div className="mt-3">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/20 px-4 py-6 transition-colors hover:bg-black/30">
                  <Plus size={24} weight="light" className="text-muted-foreground" />
                  <span className="mt-2 text-xs text-muted-foreground">
                    {uploading ? "Загрузка…" : "Нажмите, чтобы выбрать файл"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={onFileChange}
                  />
                </label>
              </div>
            ) : (
              <input
                className={`${field} mt-3`}
                placeholder="https://example.com/image.jpg"
                value={form.image_key?.startsWith("storage:") ? "" : form.image_key ?? ""}
                onChange={(e) => setForm({ ...form, image_key: e.target.value })}
              />
            )}

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Превью"
                  className="h-32 w-full rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          <input
            className={field}
            placeholder="Бейдж (Popular…)"
            value={form.badge ?? ""}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
          />
          <input
            className={field}
            placeholder="Преимущества через запятую"
            value={form.perks.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                perks: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Показывать на сайте
          </label>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onSave(form)}
            className="flex-1 rounded-full bg-foreground py-2.5 text-sm font-semibold text-background"
          >
            Сохранить
          </button>
          <button
            onClick={onCancel}
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function SupportTab() {
  const qc = useQueryClient();
  const [threadId, setThreadId] = useState<string | null>(null);
  const { data: threads } = useQuery({
    queryKey: ["admin-threads"],
    queryFn: () => adminListThreads(),
    refetchInterval: 15000,
  });
  const { data: messages } = useQuery({
    queryKey: ["admin-thread", threadId],
    queryFn: () => adminGetThreadMessages({ data: { threadId: threadId! } }),
    enabled: !!threadId,
    refetchInterval: 10000,
  });

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["admin-threads"] })}
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowClockwise size={14} weight="light" /> Обновить
        </button>
        <div className="space-y-2">
          {threads?.map((t) => (
            <button
              key={t.id}
              onClick={() => setThreadId(t.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                threadId === t.id
                  ? "border-white/30 bg-white/10"
                  : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <p className="truncate font-medium">{t.title ?? "Без названия"}</p>
              <p className="text-[11px] text-muted-foreground">
                {t.status} · {new Date(t.updated_at).toLocaleString()}
              </p>
            </button>
          ))}
          {threads?.length === 0 && (
            <p className="text-sm text-muted-foreground">Обращений пока нет</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        {!threadId ? (
          <p className="text-sm text-muted-foreground">Выберите обращение слева</p>
        ) : (
          <div className="space-y-3">
            {messages?.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-white/10"
                    : "bg-white/[0.04] text-muted-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p className="mt-1 text-[10px] opacity-60">
                  {m.role} · {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type CartItemRow = { title: string; qty: number; price: number; currency: string };

function OrdersTab() {
  const { data } = useQuery({
    queryKey: ["admin-carts"],
    queryFn: () => adminListCarts(),
    refetchInterval: 20000,
  });

  return (
    <div className="space-y-3">
      {data?.map((c) => (
        <div
          key={c.id}
          className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {formatPrice(Number(c.total))} · {c.channel ?? "—"}
            </p>
            <a
              href={`https://2gshop.com/cart/${c.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Открыть корзину
            </a>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(c.created_at).toLocaleString()}
          </p>
          <ul className="mt-2 text-xs text-muted-foreground">
            {((c.items as unknown as CartItemRow[]) ?? []).map((i, idx) => (
              <li key={idx}>
                {i.title} × {i.qty}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {data?.length === 0 && (
        <p className="text-sm text-muted-foreground">Заказов пока нет</p>
      )}
    </div>
  );
}

function SettingsTab() {
  const qc = useQueryClient();
  const save = useServerFn(adminSaveSettings);
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => adminGetSettings(),
  });
  const [form, setForm] = useState({
    whatsapp: "",
    telegram: "",
    instagram: "",
    footer_telegram: "",
    footer_instagram: "",
  });
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const field = "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-white/30";

  return (
    <div className="max-w-md space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Заказы (корзина)</p>
      <label className="block text-xs text-muted-foreground">WhatsApp (номер)</label>
      <input
        className={field}
        placeholder="+994501234567"
        value={form.whatsapp}
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
      />
      <label className="block text-xs text-muted-foreground">Telegram (username)</label>
      <input
        className={field}
        placeholder="@2gshop"
        value={form.telegram}
        onChange={(e) => setForm({ ...form, telegram: e.target.value })}
      />
      <label className="block text-xs text-muted-foreground">Instagram (username)</label>
      <input
        className={field}
        placeholder="@2gshop"
        value={form.instagram}
        onChange={(e) => setForm({ ...form, instagram: e.target.value })}
      />
      <p className="pt-4 text-xs uppercase tracking-widest text-muted-foreground">Иконки в футере</p>
      <label className="block text-xs text-muted-foreground">Telegram — ссылка или username</label>
      <input
        className={field}
        placeholder="https://t.me/2gshop"
        value={form.footer_telegram}
        onChange={(e) => setForm({ ...form, footer_telegram: e.target.value })}
      />
      <label className="block text-xs text-muted-foreground">Instagram — ссылка или username</label>
      <input
        className={field}
        placeholder="https://instagram.com/2gshop"
        value={form.footer_instagram}
        onChange={(e) => setForm({ ...form, footer_instagram: e.target.value })}
      />
      <button
        onClick={async () => {
          await save({ data: form });
          qc.invalidateQueries();
          toast.success("Контакты сохранены");
        }}
        className="mt-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background"
      >
        Сохранить
      </button>
    </div>
  );
}
