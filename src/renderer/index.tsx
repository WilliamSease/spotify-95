import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './state/store';

const container = document.getElementById('root') as HTMLElement;
document.getElementById('root')?.setAttribute('style', 'height:100%');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <div style={{width:"100%", height:"100%"}} onContextMenu={(e) => e.preventDefault()}>
    <App />
    </div>
  </Provider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
