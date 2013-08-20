from genesis.api import *
from genesis.ui import *
from genesis.plugmgr import PluginLoader, RepositoryManager


class PluginManager(CategoryPlugin, URLHandler):
    text = 'Applications'
    iconfont = 'gen-box-add'
    folder = None

    def on_session_start(self):
        self._mgr = RepositoryManager(self.app.config)

    def on_init(self):
        self._mgr.refresh()

    def get_counter(self):
        return len(self._mgr.upgradable) or None

    def get_ui(self):
        ui = self.app.inflate('plugins:main')

        inst = self._mgr.installed

        for k in inst:
            row = self.app.inflate('plugins:item')
            desc = '<span class="ui-el-label-1" style="padding-left: 5px;">%s</span>'%k.desc
            row.find('name').set('text', k.name)
            row.find('desc').set('text', k.desc)
            row.find('icon').set('class', k.iconfont)
            row.find('version').set('text', k.version)
            row.find('author').set('text', k.author)
            row.find('author').set('url', k.homepage)
            row.append('buttons', UI.TipIcon(
                        iconfont="gen-cancel-circle",
                        text='Uninstall',
                        id='remove/'+k.id,
                        warning='Are you sure you wish to remove "%s"? Software and data associated with this application will be removed.' % k.name,
                    ))

            if k.problem:
                row.find('status').set('iconfont', 'gen-close-2 text-error')
                row.find('status').set('text', 'Error')
                row.find('icon').set('class', k.iconfont + ' text-error')
                row.find('name').set('class', 'text-error')
                row.find('desc').set('class', 'text-error')
                row.append('reqs', UI.IconFont(iconfont="gen-warning text-error", text=k.problem))
            else:
                row.find('status').set('iconfont', 'gen-checkmark')
                row.find('status').set('text', 'Installed and Enabled')
            ui.append('list', row)


        lst = self._mgr.available

        btn = UI.Button(text='Check for updates', id='update')
        if len(lst) == 0:
            btn['text'] = 'Download plugin list'

        for k in lst:
            row = self.app.inflate('plugins:item')
            row.find('name').set('text', k.name)
            row.find('desc').set('text', k.description)
            row.find('icon').set('class', k.icon)
            row.find('version').set('text', k.version)
            row.find('author').set('text', k.author)
            row.find('author').set('url', k.homepage)

            for p in inst:
                if k.id == p.id and not p.problem:
                    row.find('status').set('iconfont', 'gen-arrow-up-2')
                    row.find('status').set('text', 'Upgrade Available')

            reqs = k.str_req()

            url = 'http://%s/view/plugins.php?id=%s' % (
                    self.app.config.get('genesis', 'update_server'),
                    k.id
                   )

            if reqs == '':
                row.append('buttons', UI.TipIcon(
                        iconfont="gen-box-add",
                        text='Download and install',
                        id='install/'+k.id,
                    ))
            else:
                row.append('reqs', UI.Icon(iconfont="gen-warning", text=reqs))

            ui.append('avail', row)

        return ui

    def get_ui_upload(self):
        return UI.Uploader(
            url='/upload_plugin',
            text='Install'
        )

    @url('^/upload_plugin$')
    def upload(self, req, sr):
        vars = get_environment_vars(req)
        f = vars.getvalue('file', None)
        try:
            self._mgr.install_stream(f)
        except:
            pass
        sr('301 Moved Permanently', [('Location', '/')])
        return ''

    @event('button/click')
    def on_click(self, event, params, vars=None):
        if params[0] == 'update':
            self._mgr.update_list()
            self.put_message('info', 'Plugin list updated')
        if params[0] == 'remove':
            self._mgr.remove(params[1])
            self.put_message('info', 'Plugin removed. Refresh page for changes to take effect.')
        if params[0] == 'reload':
            try:
                PluginLoader.unload(params[1])
            except:
                pass
            try:
                PluginLoader.load(params[1])
            except:
                pass
            self.put_message('info', 'Plugin reloaded. Refresh page for changes to take effect.')
        if params[0] == 'restart':
            self.app.restart()
        if params[0] == 'install':
            self._mgr.install(params[1], load=True)
            self.put_message('info', 'Plugin installed. Refresh page for changes to take effect.')
            ComponentManager.get().rescan()
            ConfManager.get().rescan();
