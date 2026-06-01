import { InspectionHeader as HeaderType, EquipmentType, EQUIPMENT_LABELS } from "@/types/inspection";

interface Props {
  header: HeaderType;
  onChange: (header: HeaderType) => void;
}

export const InspectionHeader = ({ header, onChange }: Props) => {
  const update = (field: keyof HeaderType, value: string) => {
    onChange({ ...header, [field]: value });
  };

  const PLACEHOLDER_MODELO: Record<EquipmentType, string> = {
    "escavadeira": "Ex: 130P",
    "trator-esteira": "Ex: 750J",
    "retroescavadeira": "Ex: 310P",
    "pa-carregadeira": "Ex: 524K",
    "motoniveladora": "Ex: 670G",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Dados Iniciais</h2>
        {header.rastreabilidade > 0 && (
          <span className="bg-primary/20 text-primary px-3 py-1 text-sm font-bold rounded-lg border border-primary/30">
            Tracker: Nº {String(header.rastreabilidade).padStart(5, '0')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Cliente" value={header.cliente} onChange={(v) => update("cliente", v)} />
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Equipamento</label>
          <select
            value={header.tipoEquipamento}
            disabled
            className="w-full p-3 rounded-lg border border-border bg-muted text-foreground touch-target"
          >
            {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((t) => (
              <option key={t} value={t}>{EQUIPMENT_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <Field label="Marca / Modelo John Deere" value={header.marcaModelo} onChange={(v) => update("marcaModelo", v)} placeholder={PLACEHOLDER_MODELO[header.tipoEquipamento] || "Ex: 310L"} />
        <div className="grid grid-cols-2 gap-3">
           <Field label="Ano" value={header.ano} onChange={(v) => update("ano", v)} type="number" />
           <Field label="Nº de O.S" value={header.numeroOs} onChange={(v) => update("numeroOs", v)} />
        </div>
        <Field label="Número de Série" value={header.numeroSerie} onChange={(v) => update("numeroSerie", v)} />
        <Field label="Horímetro" value={header.horimetro} onChange={(v) => update("horimetro", v)} />
        <Field label="Local da Inspeção" value={header.localInspecao} onChange={(v) => update("localInspecao", v)} />
        <Field label="Aplicação" value={header.aplicacao} onChange={(v) => update("aplicacao", v)} />
        <Field label="Técnico Responsável" value={header.tecnicoResponsavel} onChange={(v) => update("tecnicoResponsavel", v)} />
        <Field label="Data" value={header.data} onChange={(v) => update("data", v)} type="date" />

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Orçamento</label>
          <div className="flex gap-3">
            {(["sim", "nao"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => update("orcamento", opt)}
                className={`flex-1 p-3 rounded-lg border-2 font-medium touch-target transition-colors ${
                  header.orcamento === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {opt === "sim" ? "Sim" : "Não"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg border border-border bg-card text-foreground touch-target focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
