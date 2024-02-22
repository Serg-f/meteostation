from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'home.html'


class SettingsView(TemplateView):
    template_name = 'settings.html'


class SeaView(TemplateView):
    template_name = 'sea.html'


class AboutView(TemplateView):
    template_name = 'about.html'
