import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNum] = useState(100)
	window['setNum'] = setNum
	return (
		<div>
			<span>{num}</span>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<App />
);