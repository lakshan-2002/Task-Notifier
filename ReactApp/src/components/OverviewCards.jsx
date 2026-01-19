import React from 'react';
import { ListTodo, LayoutDashboard, CheckCircle } from 'lucide-react';
import './OverviewCards.css';

const OverviewCards = ({ allTasks = 0, pendingTasks = 0, completedTasks = 0, isLoading = false }) => {
  const cardsData = [
    {
      id: 1,
      title: 'All Tasks',
      value: allTasks,
      trend: '↑ 12% from last week',
      icon: ListTodo,
      colorClass: 'card-blue'
    },
    {
      id: 2,
      title: 'Pending Tasks',
      value: pendingTasks,
      trend: '↓ 5% from last week',
      icon: LayoutDashboard,
      colorClass: 'card-orange'
    },
    {
      id: 3,
      title: 'Completed Tasks',
      value: completedTasks,
      trend: '↑ 18% from last week',
      icon: CheckCircle,
      colorClass: 'card-green'
    }
  ];

  return (
    <div className="cards-grid">
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className={`card ${card.colorClass}`}>
            <div className="card-icon">
              <Icon size={28} />
            </div>
            <div className="card-content">
              <p className="card-label">{card.title}</p>
              <h3 className="card-value">
                {isLoading ? '...' : card.value}
              </h3>
              <p className="card-trend">{card.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;