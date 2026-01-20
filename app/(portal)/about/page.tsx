import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Mist Giver</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe that knowledge should be accessible to everyone. 
            Our mission is to bring the joy of reading to people around the world.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Mist Giver, we're passionate about making literature accessible to everyone, 
              regardless of their background or location. We curate a diverse collection of 
              books spanning various genres and topics to satisfy every reader's appetite.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're a casual reader looking for your next page-turner or a student 
              seeking educational resources, Mist Giver has something for you. Our platform 
              is designed to make discovery easy and reading enjoyable.
            </p>
          </div>
          <Card className="bg-muted/30 border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                  <p className="text-sm text-muted-foreground">Books Available</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">50K+</p>
                  <p className="text-sm text-muted-foreground">Active Readers</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">100+</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">24/7</p>
                  <p className="text-sm text-muted-foreground">Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quality Content</h3>
                <p className="text-sm text-muted-foreground">
                  We carefully curate every book to ensure quality reading experiences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  We build for our readers and constantly improve based on feedback.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Books should be available to everyone, everywhere, at any time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-muted/30">
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Passion</h3>
                <p className="text-sm text-muted-foreground">
                  We love books and are dedicated to sharing that love with you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Mist Giver was founded with a simple belief: everyone deserves access to great 
              literature. What started as a small collection has grown into a comprehensive 
              digital library serving readers across the globe.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our name, "Mist Giver," represents the ethereal nature of knowledge - like mist, 
              it surrounds us and shapes our understanding of the world. We aim to be the 
              source that provides this mist of wisdom to every curious mind.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we continue to expand our collection and improve our platform, always 
              keeping our readers at the heart of everything we do. Join us on this journey 
              of discovery and let the world of books transform your life.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
