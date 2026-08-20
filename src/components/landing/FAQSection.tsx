import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FAQItem = { question: string; answer: string };

const FAQSection = ({ title, items }: { title?: string; items: FAQItem[] }) => {
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
