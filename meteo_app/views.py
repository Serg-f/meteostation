from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'home.html'
    extra_context = {'menu': 0}


class SettingsView(TemplateView):
    template_name = 'settings.html'
    extra_context = {'menu': 1}


class SeaView(TemplateView):
    template_name = 'sea.html'
    extra_context = {'menu': 2}


class AboutView(TemplateView):
    template_name = 'about.html'
    extra_context = {'menu': 3}
