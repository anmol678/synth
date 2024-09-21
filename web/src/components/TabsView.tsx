
export default function TabsView({ tabs, activeTab, setActiveTab }: { tabs: string[]; activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}