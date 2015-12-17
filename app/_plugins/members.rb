module Jekyll

  class MemberPage < Page
    def initialize(site, base, dir, member)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'members.html')

      self.data['title'] = member['name']
    end
  end

  class MembersPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'members'
        dir = 'leden'

        result = File.read( 'app/_data/members.json' )
        members = JSON.parse( result )

        members['member'].each_key do |member|
          site.pages << MemberPage.new(site, site.source, File.join(dir, member), member)
        end

      end
    end
  end

end