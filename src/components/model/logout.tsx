import Modal from "../animationComponents/animated-model";

<Modal className="max-w-lg p-6 rounded-lg shadow-lg" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
<h2 className="text-xl font-semibold mb-4">Hello Modal 👋</h2>
<p className="text-gray-600 dark:text-gray-300">
  This is a reusable animated modal using Framer Motion.
</p>
</Modal>