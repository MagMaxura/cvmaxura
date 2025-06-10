import React, { useState, useEffect } from 'react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { PlusCircle, Trash2, Edit3, Check, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { Slider } from '@/components/ui/slider';

    const languageLevels = ["Básico", "Intermedio", "Avanzado", "Nativo"];

    const LanguageItem = ({ language, index, onUpdate, onRemove, onToggleEdit, isEditing }) => {
      const [editedLang, setEditedLang] = useState(language);

      useEffect(() => {
        setEditedLang(language);
      }, [language]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLang(prev => ({ ...prev, [name]: value }));
      };
      
      const handleLevelChange = (value) => {
        setEditedLang(prev => ({ ...prev, level: languageLevels[value[0]] }));
      };

      const handleSave = () => {
        onUpdate(index, editedLang);
      };
      
      const currentLevelIndex = languageLevels.indexOf(editedLang.level);

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600/50 mb-2"
        >
          {isEditing ? (
            <div className="space-y-3">
              <Input name="name" value={editedLang.name} onChange={handleChange} placeholder="Idioma" className="bg-white dark:bg-slate-600" />
              <div>
                <Label className="text-sm text-slate-600 dark:text-slate-300">Nivel: {editedLang.level}</Label>
                <Slider
                  defaultValue={[currentLevelIndex !== -1 ? currentLevelIndex : 1]}
                  min={0}
                  max={languageLevels.length - 1}
                  step={1}
                  onValueChange={handleLevelChange}
                  className="my-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={handleSave} size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"><Check size={16} /></Button>
                <Button onClick={() => onToggleEdit(index)} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"><X size={16} /></Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{language.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Nivel: {language.level}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => onToggleEdit(index)} size="icon" variant="ghost" className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-teal-400"><Edit3 size={16} /></Button>
                <Button onClick={() => onRemove(index)} size="icon" variant="ghost" className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"><Trash2 size={16} /></Button>
              </div>
            </div>
          )}
        </motion.div>
      );
    };

    const LanguagesStep = ({ cvData, addListItem, updateListItem, removeListItem, onStepComplete }) => {
      const [languages, setLanguages] = useState(cvData.languages || []);
      const [newLang, setNewLang] = useState({ name: '', level: languageLevels[1] }); // Default to Intermedio
      const [editingIndex, setEditingIndex] = useState(null);
      const { toast } = useToast();

      const handleNewLangChange = (e) => {
        const { name, value } = e.target;
        setNewLang(prev => ({ ...prev, [name]: value }));
      };
      
      const handleNewLevelChange = (value) => {
        setNewLang(prev => ({ ...prev, level: languageLevels[value[0]] }));
      };

      const addLanguage = () => {
        if (!newLang.name) {
          toast({ title: "Campo incompleto", description: "Por favor, ingresa el nombre del idioma.", variant: "destructive" });
          return;
        }
        const newLangEntry = { ...newLang };
        setLanguages(prev => [...prev, newLangEntry]);
        addListItem('languages', newLangEntry);
        setNewLang({ name: '', level: languageLevels[1] });
        toast({ title: "Idioma agregado", description: `${newLangEntry.name} ha sido añadido.`, className: "bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600" });
      };

      const updateLanguage = (index, updatedLang) => {
        const updatedLangs = languages.map((lang, i) => i === index ? updatedLang : lang);
        setLanguages(updatedLangs);
        updateListItem('languages', index, updatedLang);
        setEditingIndex(null);
        toast({ title: "Idioma actualizado", description: `${updatedLang.name} ha sido modificado.`, className: "bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600" });
      };

      const removeLanguage = (index) => {
        const langNameToRemove = languages[index].name;
        const updatedLangs = languages.filter((_, i) => i !== index);
        setLanguages(updatedLangs);
        removeListItem('languages', index);
        toast({ title: "Idioma eliminado", description: `${langNameToRemove} ha sido eliminado.`, variant: "destructive" });
      };

      const toggleEdit = (index) => {
        setEditingIndex(editingIndex === index ? null : index);
      };
      
      const inputClass = "bg-slate-50/70 dark:bg-slate-700/60 border-gray-300 dark:border-slate-600 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-600/90 focus:border-primary dark:focus:border-teal-500 text-base p-2.5 h-11 rounded-lg transition-colors duration-200";
      const labelClass = "text-slate-700 dark:text-gray-200 text-sm font-medium mb-1 block";

      return (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5 p-1.5 w-full max-w-2xl"
        >
          <Card className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 dark:text-gray-100">Añadir Idioma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="langName" className={labelClass}>Idioma</Label>
                <Input id="langName" name="name" value={newLang.name} onChange={handleNewLangChange} placeholder="Ej: Inglés" className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>Nivel: {newLang.level}</Label>
                <Slider
                  defaultValue={[languageLevels.indexOf(newLang.level)]}
                  min={0}
                  max={languageLevels.length - 1}
                  step={1}
                  onValueChange={handleNewLevelChange}
                  className="my-2"
                />
              </div>
              <Button onClick={addLanguage} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Idioma
              </Button>
            </CardContent>
          </Card>

          {languages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-slate-800 dark:text-gray-100">Idiomas Agregados:</h3>
              <AnimatePresence>
                {languages.map((lang, index) => (
                  <LanguageItem
                    key={index}
                    language={lang}
                    index={index}
                    onUpdate={updateLanguage}
                    onRemove={removeLanguage}
                    onToggleEdit={toggleEdit}
                    isEditing={editingIndex === index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                if (languages.length === 0) {
                  toast({
                    title: "Campos obligatorios incompletos",
                    description: "Por favor, añade al menos un idioma.",
                    variant: "destructive",
                  });
                  return;
                }
                onStepComplete();
              }}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-500/20"
            >
                Siguiente Sección
            </Button>
          </div>
        </motion.div>
      );
    };

    export default LanguagesStep;