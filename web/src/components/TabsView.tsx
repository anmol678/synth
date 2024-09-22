import { Tab } from '@/types'

export default function TabsView({ tabs, activeTab, setActiveTab }: { tabs: Tab[]; activeTab: Tab; setActiveTab: (tab: Tab) => void }) {
  return (
    <div className="flex border-b-2">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`px-4 py-2 font-semibold ${activeTab === tab ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}
