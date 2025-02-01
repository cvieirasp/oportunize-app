import {
  Briefcase,
  Users,
  Zap,
  Eye,
  SmileIcon as Tooth,
  Heart,
  Umbrella,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  Bitcoin,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
} from "lucide-react"

interface Benefit {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const benefits: Benefit[] = [
  { 
    id: "retirement",
    label: "Plano de aposentadoria",
    icon: <Briefcase className="w-3 h-3" />
  },
  {
    id: "distributed",
    label: "Equipe distribuída",
    icon: <Users className="w-3 h-3" />,
  },
  {
    id: "async",
    label: "Assíncrono",
    icon: <Zap className="w-3 h-3" />
  },
  {
    id: "vision",
    label: "Seguro de Visão",
    icon: <Eye className="w-3 h-3" />,
  },
  {
    id: "dental",
    label: "Seguro Odontológico",
    icon: <Tooth className="w-3 h-3" />,
  },
  {
    id: "medical",
    label: "Seguro de Saúde",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "unlimited_vacation",
    label: "Férias Ilimitadas",
    icon: <Umbrella className="w-3 h-3" />,
  },
  {
    id: "pto",
    label: "Folgas remuneradas",
    icon: <Clock className="w-3 h-3" />
  },
  {
    id: "four_day",
    label: "Semana de trabalho de 4 dias",
    icon: <Calendar className="w-3 h-3" />,
  },
  {
    id: "company_retreats",
    label: "Retiro Corporativo",
    icon: <Building className="w-3 h-3" />,
  },
  {
    id: "coworking_budget",
    label: "Orçamento para Coworking",
    icon: <Building className="w-3 h-3" />,
  },
  {
    id: "learning_budget",
    label: "Orçamento para Aprendizado",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  {
    id: "gym",
    label: "Academia Gratuita",
    icon: <Dumbbell className="w-3 h-3" />,
  },
  {
    id: "mental_wellness",
    label: "Orçamento para Bem-estar Mental",
    icon: <Brain className="w-3 h-3" />,
  },
  {
    id: "home_office",
    label: "Orçamento para Home Office",
    icon: <Home className="w-3 h-3" />,
  },
  {
    id: "crypto",
    label: "Pagamento em Criptomoeda",
    icon: <Bitcoin className="w-3 h-3" />,
  },
  {
    id: "pseudonymous",
    label: "Pseudônimo Permitido",
    icon: <UserCircle className="w-3 h-3" />,
  },
  {
    id: "profit_sharing",
    label: "Participação nos Lucros",
    icon: <PieChart className="w-3 h-3" />,
  },
  {
    id: "equity",
    label: "Compensação em Ações",
    icon: <Coins className="w-3 h-3" />,
  },
  {
    id: "no_whiteboard",
    label: "Sem Entrevista com Quadro Branco",
    icon: <MonitorOff className="w-3 h-3" />,
  },
  {
    id: "no_monitoring",
    label: "Sem Sistema de Monitoramento",
    icon: <Shield className="w-3 h-3" />,
  },
  {
    id: "hire_old_young",
    label: "Contratamos Todas as Idades",
    icon: <UserPlus className="w-3 h-3" />,
  },
]
