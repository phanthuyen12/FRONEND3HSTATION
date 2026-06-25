import React, { useEffect, useMemo, useState } from "react";
import { PageBreadcrumb } from "../../../components";
import configService from "../../../services/configService";
import {
  buildAeTradingLandingShareLink,
  getDefaultAeTradingRefLinks,
  parseAeTradingRefLinks,
  serializeAeTradingRefLinks,
  type AeTradingRefLinkItem,
} from "../../../helpers/aeTradingRefLinks";

const SupportRefLinksAdmin: React.FC = () => {
  const [items, setItems] = useState<AeTradingRefLinkItem[]>(getDefaultAeTradingRefLinks());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadConfigs = async () => {
      try {
        setLoading(true);
        const configs = await configService.getConfigs();
        setItems(parseAeTradingRefLinks(configs.landing_ref_links));
      } catch (err: any) {
        setError(err?.message || "Khong the tai cau hinh ref links");
      } finally {
        setLoading(false);
      }
    };

    loadConfigs();
  }, []);

  const jsonPreview = useMemo(() => serializeAeTradingRefLinks(items), [items]);

  const updateItem = (
    index: number,
    field: keyof AeTradingRefLinkItem,
    value: string | boolean
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        key: "",
        label: "",
        url: "",
        buttonText: "Tham gia ngay",
        description: "",
        enabled: true,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await configService.updateConfigs({
        landing_ref_links: jsonPreview,
      });
      setSuccess("Da luu cau hinh ref links");
    } catch (err: any) {
      setError(err?.message || "Khong the luu cau hinh ref links");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="Link Ref Quang Cao"
        name="Landing Ref Links"
        breadCrumbItems={["Admin", "Ho tro", "Ref Links"]}
      />

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="mb-1">Quan ly ref link cho landing AE Trading</h4>
              <p className="mb-0 text-slate-500">
                Vi du `?ref=zalo` se lay link tu cau hinh `zalo`, mo form dang ky, luu
                vao module ho tro roi moi chuyen huong.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-light" type="button" onClick={addItem}>
                Them ref
              </button>
              <button className="btn btn-primary" type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Dang luu..." : "Luu cau hinh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          {loading ? (
            <div className="py-5 text-center text-slate-500">Dang tai du lieu...</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Ref key</th>
                    <th>Nhan hien thi</th>
                    <th>Link dich</th>
                    <th>Nut CTA</th>
                    <th>Mo ta</th>
                    <th>Bat</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const sampleLink = buildAeTradingLandingShareLink(
                      window.location.origin,
                      item.key || "zalo"
                    );

                    return (
                      <tr key={`${item.key || "new"}-${index}`}>
                        <td style={{ minWidth: 140 }}>
                          <input
                            className="form-control"
                            value={item.key}
                            onChange={(event) => updateItem(index, "key", event.target.value)}
                            placeholder="zalo"
                          />
                          <div className="mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={async () => {
                                await navigator.clipboard.writeText(sampleLink);
                              }}
                            >
                              Copy link share
                            </button>
                          </div>
                        </td>
                        <td style={{ minWidth: 180 }}>
                          <input
                            className="form-control"
                            value={item.label}
                            onChange={(event) => updateItem(index, "label", event.target.value)}
                            placeholder="Nhom Zalo AE Trading"
                          />
                        </td>
                        <td style={{ minWidth: 260 }}>
                          <input
                            className="form-control"
                            value={item.url}
                            onChange={(event) => updateItem(index, "url", event.target.value)}
                            placeholder="https://zalo.me/..."
                          />
                          <div className="mt-2 text-xs text-slate-500 break-all">{sampleLink}</div>
                        </td>
                        <td style={{ minWidth: 180 }}>
                          <input
                            className="form-control"
                            value={item.buttonText}
                            onChange={(event) => updateItem(index, "buttonText", event.target.value)}
                            placeholder="Tham gia nhom Zalo ngay"
                          />
                        </td>
                        <td style={{ minWidth: 220 }}>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={item.description}
                            onChange={(event) => updateItem(index, "description", event.target.value)}
                            placeholder="Mo ta ngan cho kenh ref nay"
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(event) => updateItem(index, "enabled", event.target.checked)}
                          />
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeItem(index)}
                          >
                            Xoa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">JSON luu vao `system_configs.landing_ref_links`</h5>
          <pre className="mb-0 rounded border bg-slate-50 p-4 text-xs text-slate-700 whitespace-pre-wrap">
            {jsonPreview}
          </pre>
        </div>
      </div>
    </>
  );
};

export default SupportRefLinksAdmin;
