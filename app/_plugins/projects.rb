module Jekyll

  class ProjectPage < Page
    def initialize(site, base, dir, project)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'project.html')


      self.data['title'] = project['title']
      self.data['project'] = project
    end
  end

  class ProjectsPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'project'
        dir = 'inspiratie'

        result = File.read( 'app/_data/projects.json' )
        projects = JSON.parse( result )

        projects.each do |project|
          site.pages << ProjectPage.new(site, site.source, File.join(dir, project['slug']), project)
        end

      end
    end
  end

end