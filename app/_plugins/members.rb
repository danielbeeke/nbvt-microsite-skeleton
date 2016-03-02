module Jekyll

  class MemberPage < Page
    def initialize(site, base, dir, member)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'members.html')

      self.data['has_menu_object'] = true
      self.data['title'] = member['name']
      self.data['member'] = member
    end
  end

  class MembersPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'members'
        dir = 'verkooppunten'

        result = File.read( 'app/_data/members.json' )
        members = JSON.parse( result )

        members.each do |member|
          site.pages << MemberPage.new(site, site.source, File.join(dir, member['slug']), member)
        end

      end
    end
  end

end