// pages/index.tsx
import QuillEditor from '../components/QuillEditor';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Quill.js Editor in Next.js</h1>
      <QuillEditor readonly:false />
    </div>
  );
};
  
export default HomePage;
