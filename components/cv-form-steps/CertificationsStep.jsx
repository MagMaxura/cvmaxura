import React, { useState, useEffect } from 'react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { PlusCircle, Trash2, Edit3, Check, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';

    const CertificationItem = ({ certification, index, onUpdate, onRemove, onToggleEdit, isEditing }) => {
      const [editedCert, setEditedCert] = useState(certification);

      useEffect(() => {
        setEditedCert(certification);
      }, [certification]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCert(prev => ({ ...prev, [name]: value }));
      };

      const handleSave = () => {
        onUpdate(index, editedCert);
      };

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600/50 mb-2"
        >
          {isEditing ? (
            <div className="space-y-2">
              <Input name="name" value={editedCert.name} onChange={handleChange} placeholder="Nombre de la Certificación" className="bg-white dark:bg-slate-600" />
              <Input name="issuingOrganization" value={editedCert.issuingOrganization} onChange={handleChange} placeholder="Organización Emisora" className="bg-white dark:bg-slate-600" />
              <Input name="dateObtained" value={editedCert.dateObtained} onChange={handleChange} placeholder="Fecha (Ej: Ene 2023)" className="bg-white dark:bg-slate-600" />
              <Input name="link" value={editedCert.link} onChange={handleChange} placeholder="Enlace (Opcional)" className="bg-white dark:bg-slate-600" />
              <div className="flex justify-end space-x-2">
                <Button onClick={handleSave} size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"><Check size={16} /></Button>
                <Button onClick={() => onToggleEdit(index)} size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"><X size={16} /></Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{certification.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{certification.issuingOrganization} - {certification.dateObtained}</p>
                {certification.link && <a href={certification.link} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-500 hover:underline">Ver Credencial</a>}
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

    const CertificationsStep = ({ cvStoreData, onStepComplete }) => {
      // --- AÑADIR ESTA VERIFICACIÓN AQUÍ ---
      if (!cvStoreData) {
        return <p>Cargando...</p>;
      }
      // ------------------------------------
      const { cvData, updateCertifications } = cvStoreData; // Desestructurar cvData y updateCertifications
      const [certifications, setCertifications] = useState(cvData.certifications || []);
      const [newCert, setNewCert] = useState({ name: '', issuingOrganization: '', dateObtained: '', link: '' });
      const [editingIndex, setEditingIndex] = useState(null);
      const { toast } = useToast();

      const handleNewCertChange = (e) => {
        const { name, value } = e.target;
        setNewCert(prev => ({ ...prev, [name]: value }));
      };

      const addCertification = () => {
        if (!newCert.name || !newCert.issuingOrganization || !newCert.dateObtained) {
          toast({ title: "Campos incompletos", description: "Por favor, completa nombre, organización y fecha.", variant: "destructive" });
          return;
        }
        const updatedCerts = [...certifications, newCert];
        setCertifications(updatedCerts);
        updateCertifications(updatedCerts); // Usar updateCertifications
        setNewCert({ name: '', issuingOrganization: '', dateObtained: '', link: '' });
        toast({ title: "Certificación agregada", description: `${newCert.name} ha sido añadida.`, className: "bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600" });
      };

      const updateCertification = (index, updatedCert) => {
        const updatedCerts = certifications.map((cert, i) => i === index ? updatedCert : cert);
        setCertifications(updatedCerts);
        updateCertifications(updatedCerts); // Usar updateCertifications
        setEditingIndex(null);
        toast({ title: "Certificación actualizada", description: `${updatedCert.name} ha sido modificada.`, className: "bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600" });
      };

      const removeCertification = (index) => {
        const certNameToRemove = certifications[index].name;
        const updatedCerts = certifications.filter((_, i) => i !== index);
        setCertifications(updatedCerts);
        updateCertifications(updatedCerts); // Usar updateCertifications
        toast({ title: "Certificación eliminada", description: `${certNameToRemove} ha sido eliminada.`, variant: "destructive" });
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
              <CardTitle className="text-lg text-slate-800 dark:text-gray-100">Añadir Certificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="certName" className={labelClass}>Nombre de la Certificación</Label>
                <Input id="certName" name="name" value={newCert.name} onChange={handleNewCertChange} placeholder="Ej: Scrum Master Certified" className={inputClass} />
              </div>
              <div>
                <Label htmlFor="certOrg" className={labelClass}>Organización Emisora</Label>
                <Input id="certOrg" name="issuingOrganization" value={newCert.issuingOrganization} onChange={handleNewCertChange} placeholder="Ej: Scrum Alliance" className={inputClass} />
              </div>
              <div>
                <Label htmlFor="certDate" className={labelClass}>Fecha de Obtención</Label>
                <Input id="certDate" name="dateObtained" value={newCert.dateObtained} onChange={handleNewCertChange} placeholder="Ej: Enero 2023" className={inputClass} />
              </div>
              <div>
                <Label htmlFor="certLink" className={labelClass}>Enlace a la Credencial (Opcional)</Label>
                <Input id="certLink" name="link" value={newCert.link} onChange={handleNewCertChange} placeholder="https://ejemplo.com/certificado" className={inputClass} />
              </div>
              <Button onClick={addCertification} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Certificación
              </Button>
            </CardContent>
          </Card>

          {certifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-slate-800 dark:text-gray-100">Certificaciones Agregadas:</h3>
              <AnimatePresence>
                {certifications.map((cert, index) => (
                  <CertificationItem
                    key={index}
                    certification={cert}
                    index={index}
                    onUpdate={updateCertification}
                    onRemove={removeCertification}
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
                if (certifications.length === 0) {
                  toast({
                    title: "Campos obligatorios incompletos",
                    description: "Por favor, añade al menos una certificación.",
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

    export default CertificationsStep;