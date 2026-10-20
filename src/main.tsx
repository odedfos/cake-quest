import { render } from 'preact';
import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/rubik/hebrew-500.css';
import './styles.css';
import { App } from './app';

render(<App />, document.getElementById('app')!);
