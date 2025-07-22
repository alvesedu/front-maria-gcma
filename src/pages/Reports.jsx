// src/pages/Reports.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import apiService from '../services/api';
import { Select } from '@/components/ui/select';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#a4de6c'];

const chartOptions = [
  { value: 'victimsPerMonth', label: 'Vítimas Atendidas por Mês' },
  { value: 'violenceTypes', label: 'Tipos de Violência' },
  { value: 'authorsByMunicipality', label: 'Autores por Município' },
  { value: 'avgChildren', label: 'Média de Filhos por Categoria' },
  { value: 'housingIncome', label: 'Moradia × Renda Familiar' },
  { value: 'ageDistribution', label: 'Distribuição Etária (Vítimas vs Autores)' },
];

export default function Reports() {
  const [victimsPerMonth, setVictimsPerMonth] = useState([]);
  const [violenceTypes, setViolenceTypes] = useState([]);
  const [authorsByMunicipality, setAuthorsByMunicipality] = useState([]);
  const [avgChildren, setAvgChildren] = useState([]);
  const [housingIncome, setHousingIncome] = useState([]);
  const [stackedHousingData, setStackedHousingData] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [ageDist, setAgeDist] = useState([]);
  const [selectedChart, setSelectedChart] = useState('victimsPerMonth');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [perMonth, types, byMun, avgCh, hInc, ageD] = await Promise.all([
          apiService.getVictimsPerMonth(),
          apiService.getViolenceTypesBreakdown(),
          apiService.getAuthorsByMunicipality(),
          apiService.getAvgChildren(),
          apiService.getHousingIncome(),
          apiService.getAgeDistribution()
        ]);

        setVictimsPerMonth(perMonth);
        setViolenceTypes(types);
        setAuthorsByMunicipality(byMun);
        setAvgChildren(avgCh);
        setHousingIncome(hInc);
        setAgeDist(ageD);

        const housings = Array.from(new Set(hInc.map(d => d.housing)));
        const incomes = Array.from(new Set(hInc.map(d => d.income)));
        setIncomeCategories(incomes);
        const pivot = housings.map(h => {
          const row = { housing: h };
          incomes.forEach(i => {
            const found = hInc.find(d => d.housing === h && d.income === i);
            row[i] = found ? found.count : 0;
          });
          return row;
        });
        setStackedHousingData(pivot);
      } catch (err) {
        console.error(err);
        setError('Falha ao carregar relatórios');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderChart = () => {
    switch (selectedChart) {
      case 'victimsPerMonth':
        return (
          <BarChart data={victimsPerMonth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis /><Tooltip /><Bar dataKey="count" fill={COLORS[0]} /></BarChart>
        );
      case 'violenceTypes':
        return (
          <PieChart>
            <Pie data={violenceTypes} dataKey="count" nameKey="_id" outerRadius={80} label>
              {violenceTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        );
      case 'authorsByMunicipality':
        return (
          <BarChart data={authorsByMunicipality}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis /><Tooltip /><Bar dataKey="count" fill={COLORS[2]} /></BarChart>
        );
      case 'avgChildren':
        return (
          <BarChart data={avgChildren}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="avg" fill={COLORS[3]} /></BarChart>
        );
      case 'housingIncome':
        return (
          <BarChart data={stackedHousingData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="housing" /><YAxis /><Tooltip /><Legend />
            {incomeCategories.map((inc, i) => <Bar key={inc} dataKey={inc} stackId="a" fill={COLORS[i % COLORS.length]} name={inc} />)}
          </BarChart>
        );
      case 'ageDistribution':
        return (
          <BarChart data={ageDist}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" /><YAxis /><Tooltip /><Legend /><Bar dataKey="victims" fill={COLORS[1]} name="Vítimas" /><Bar dataKey="authors" fill={COLORS[4]} name="Autores" /></BarChart>
        );
      default:
        return null;
    }
  };

  if (loading) return <Layout><p className="text-center text-white">Carregando relatórios...</p></Layout>;
  if (error) return <Layout><p className="text-center text-red-400">{error}</p></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl text-white mb-6">Relatórios</h2>

      <div className="mb-6">
        <label className="text-white font-medium mr-3">Selecione o Relatório:</label>
        <select
          className="p-2 rounded bg-gray-800 text-white"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
        >
          {chartOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{chartOptions.find(c => c.value === selectedChart)?.label}</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        </CardContent>
      </Card>
    </Layout>
  );
}
