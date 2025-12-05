import React, { Suspense, ComponentType } from "react";
import ChariusWrapper from "../ChariusWrapper";
import { chariusPages } from "./chariusImports";

interface ChariusPageWrapperProps {
  componentPath: string;
  componentName: string;
}

/**
 * Wrapper component để load các pages từ charius-react
 * Sử dụng static imports mapping để Vite có thể analyze đúng cách
 */
const ChariusPageWrapper: React.FC<ChariusPageWrapperProps> = ({ 
  componentPath, 
  componentName 
}) => {
  const [Component, setComponent] = React.useState<ComponentType | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Normalize component path
    const importPath = componentPath.endsWith('.jsx') 
      ? componentPath 
      : componentPath.endsWith('.js') 
        ? componentPath.replace(/\.js$/, '.jsx')
        : componentPath + '.jsx';
    
    // Lookup component từ static imports mapping
    const component = chariusPages[importPath];
    
    if (component) {
      setComponent(() => component);
    } else {
      console.error(`Component not found: ${importPath}`);
      setError(`Component ${componentName} not found in charius pages mapping.`);
    }
  }, [componentPath, componentName]);

  if (error) {
    return (
      <ChariusWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Component path: {componentPath}
            </p>
          </div>
        </div>
      </ChariusWrapper>
    );
  }

  if (!Component) {
    return (
      <ChariusWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading {componentName}...</p>
          </div>
        </div>
      </ChariusWrapper>
    );
  }

  return (
    <ChariusWrapper>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <Component />
      </Suspense>
    </ChariusWrapper>
  );
};

export default ChariusPageWrapper;

