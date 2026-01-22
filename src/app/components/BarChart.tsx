import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData } from "chart.js";
import { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
    data: ChartData<"bar", number[], string>; // adapt TData/TLabel to your use case
    options?: ChartOptions<"bar">; // optional Chart.js options
  }

const BarChart: React.FC<BarChartProps> = ({ data, options}) => {
  return <Bar data={data} options={options}  />;
};

export default BarChart;
