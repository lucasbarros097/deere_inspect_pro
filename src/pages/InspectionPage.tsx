import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInspectionById, saveInspection } from "@/store/inspectionStore";
import { getNextRastreabilidade } from "@/lib/inspectionsApi";
import { Inspection, EQUIPMENT_LABELS } from "@/types/inspection";
import { InspectionHeader } from "@/components/inspection/InspectionHeader";
import { AnalysisRequestSection } from "@/components/inspection/AnalysisRequestSection";
import { OperatingConditionsSection } from "@/components/inspection/OperatingConditionsSection";
import { DiagnosticoSection } from "@/components/inspection/DiagnosticoSection";
import { ChecklistSectionView } from "@/components/inspection/ChecklistSectionView";
import { KanbanSection } from "@/components/inspection/KanbanSection";
import { PhotosSection } from "@/components/inspection/PhotosSection";
import { SignatureSection } from "@/components/inspection/SignatureSection";
import { getSectionsForEquipment } from "@/data/checklistSections";
import { ArrowLeft, Save, ChevronRight } from "lucide-react";

type Tab = "dados" | "analise" | "condicoes" | "diagnostico" | "checklist" | "kanban" | "fotos" | "assinatura";

const TABS: { key: Tab; label: string }[] = [
  { key: "dados", label: "Dados Iniciais" },
  { key: "analise", label: "Solicitação" },
  { key: "condicoes", label: "Condições" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "checklist", label: "Checklist" },
  { key: "kanban", label: "Kanban" },
  { key: "fotos", label: "Fotos" },
  { key: "assinatura", label: "Finalizar" },
];

const InspectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dados");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      const data = getInspectionById(id);
      if (data) {
        // Migrate old inspections missing diagnostico
        if (!data.diagnostico) {
          (data as any).diagnostico = {
            ferramentasUtilizadas: "SERVICE ADVISOR",
            manualPerformance: "",
            codigosAtivos: "",
            codigosPresentes: "",
          };
        }
        setInspection(data);
      } else navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    // Generate tracking number automatically if it's 0 
    if (inspection && inspection.header.rastreabilidade === 0 && navigator.onLine) {
       getNextRastreabilidade().then(num => {
           const updated = { ...inspection };
           updated.header.rastreabilidade = num;
           setInspection(updated);
           saveInspection(updated);
       });
    }
  }, [inspection?.header.rastreabilidade]);

  const handleUpdate = useCallback(
    (updates: Partial<Inspection>) => {
      if (!inspection) return;
      const updated = { ...inspection, ...updates };
      setInspection(updated);
      saveInspection(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    },
    [inspection]
  );

  if (!inspection) return null;

  const sections = getSectionsForEquipment(inspection.header.tipoEquipamento);

  return (
    <div className="min-h-screen bg-background">
      <header className="industrial-header px-4 py-3 sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-jd-yellow touch-target">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">Voltar</span>
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-jd-yellow">
              {EQUIPMENT_LABELS[inspection.header.tipoEquipamento]}
            </p>
            <p className="text-xs text-industrial-dark-foreground/60">
              {inspection.header.cliente || "Nova inspeção"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-status-ok animate-pulse-warning">Salvo ✓</span>
            )}
            <Save className="h-5 w-5 text-industrial-dark-foreground/50" />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-card border-b border-border overflow-x-auto no-scrollbar scroll-smooth sticky top-[52px] z-40">
        <div className="container max-w-4xl mx-auto flex w-max min-w-full px-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors touch-target flex-none ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {activeTab === "dados" && (
          <InspectionHeader
            header={inspection.header}
            onChange={(header) => handleUpdate({ header })}
          />
        )}
        {activeTab === "analise" && (
          <AnalysisRequestSection
            data={inspection.analysisRequest}
            onChange={(analysisRequest) => handleUpdate({ analysisRequest })}
          />
        )}
        {activeTab === "condicoes" && (
          <OperatingConditionsSection
            data={inspection.operatingConditions}
            onChange={(operatingConditions) => handleUpdate({ operatingConditions })}
          />
        )}
        {activeTab === "diagnostico" && (
          <DiagnosticoSection
            data={inspection.diagnostico}
            onChange={(diagnostico) => handleUpdate({ diagnostico })}
          />
        )}
        {activeTab === "checklist" && (
          <div className="space-y-4">
            {sections.map((section) => (
              <ChecklistSectionView
                key={section.id}
                section={section}
                items={inspection.checklistData[section.id] || []}
                onChange={(items) =>
                  handleUpdate({
                    checklistData: {
                      ...inspection.checklistData,
                      [section.id]: items,
                    },
                  })
                }
              />
            ))}
          </div>
        )}
        {activeTab === "kanban" && (
          <KanbanSection
            items={inspection.kanban}
            onChange={(kanban) => handleUpdate({ kanban })}
          />
        )}
        {activeTab === "fotos" && (
          <PhotosSection
            fotos={inspection.fotos || []}
            onChange={(fotos) => handleUpdate({ fotos })}
          />
        )}
        {activeTab === "assinatura" && (
          <SignatureSection
            inspection={inspection}
            onSign={(assinaturaTecnico) =>
              handleUpdate({ assinaturaTecnico, status: "finalizada" })
            }
          />
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              const idx = TABS.findIndex((t) => t.key === activeTab);
              if (idx > 0) setActiveTab(TABS[idx - 1].key);
            }}
            disabled={activeTab === TABS[0].key}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted text-muted-foreground disabled:opacity-30 touch-target font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
          <button
            onClick={() => {
              const idx = TABS.findIndex((t) => t.key === activeTab);
              if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
            }}
            disabled={activeTab === TABS[TABS.length - 1].key}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 touch-target font-medium"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default InspectionPage;
