import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Connect to newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-none">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
        <p className="text-blue-100 text-sm mb-4">
          Get the latest tech news delivered to your inbox every week.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white text-slate-900 placeholder-slate-500 border-0"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-primary hover:bg-blue-50"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>
        <p className="text-blue-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
      </CardContent>
    </Card>
  );
}
