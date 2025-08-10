'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';

const formSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.enum(['sole proprietorship', 'partnership', 'limited liability company', 'corporation']),
  KRAPin: z.string().min(1, 'KRA PIN is required'),
  nssfEmployer: z.string().optional(),
  shifEmployer: z.string().optional(),
  helbEmployer: z.string().optional(),
  housingLevyEmployer: z.string().optional(),
  address: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email('Invalid email').optional(),
  logo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCompanyForm({ ownerId }: { ownerId: string }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      let logoUrl = null;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${ownerId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, logoFile, { upsert: false });

        if (uploadError) {
          toast.error('Error uploading logo');
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('company-logos')
          .getPublicUrl(fileName);

        logoUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('Company').insert({
        ownerId,
        businessName: values.businessName,
        businessType: values.businessType,
        KRAPin: values.KRAPin,
        nssfEmployer: values.nssfEmployer,
        shifEmployer: values.shifEmployer,
        helbEmployer: values.helbEmployer,
        housingLevyEmployer: values.housingLevyEmployer,
        address: values.address,
        companyPhone: values.companyPhone,
        companyEmail: values.companyEmail,
        logo: logoUrl,
        status: 'active',
        onboardingComplete: false,
      });

      if (insertError) {
        toast.error(insertError.message);
        return;
      }

      toast.success('Company added successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Business Name" {...register('businessName')} />
      {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}

      <Select onValueChange={(val) => setValue('businessType', val as FormValues['businessType'])}>
        <SelectTrigger>
          <SelectValue placeholder="Select business type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sole proprietorship">Sole Proprietorship</SelectItem>
          <SelectItem value="partnership">Partnership</SelectItem>
          <SelectItem value="limited liability company">Limited Liability Company</SelectItem>
          <SelectItem value="corporation">Corporation</SelectItem>
        </SelectContent>
      </Select>
      {errors.businessType && <p className="text-red-500 text-sm">{errors.businessType.message}</p>}

      <Input placeholder="KRA PIN" {...register('KRAPin')} />
      {errors.KRAPin && <p className="text-red-500 text-sm">{errors.KRAPin.message}</p>}

      <Input placeholder="NSSF Employer" {...register('nssfEmployer')} />
      <Input placeholder="SHIF Employer" {...register('shifEmployer')} />
      <Input placeholder="HELB Employer" {...register('helbEmployer')} />
      <Input placeholder="Housing Levy Employer" {...register('housingLevyEmployer')} />
      <Textarea placeholder="Address" {...register('address')} />
      <Input placeholder="Company Phone" {...register('companyPhone')} />
      <Input placeholder="Company Email" type="email" {...register('companyEmail')} />

      {/* Drag & Drop Logo Upload */}
      <div
        className={clsx(
          'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition',
          logoFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-[#7F5EFD]'
        )}
        onClick={() => document.getElementById('logo-upload')?.click()}
      >
        {logoFile ? (
          <>
            <p className="text-sm mb-2">{logoFile.name}</p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setLogoFile(null);
              }}
            >
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 mb-2 text-[#7F5EFD]" />
            <p className="text-sm text-gray-500">Click or drag logo file here</p>
          </>
        )}
      </div>
      <input
        id="logo-upload"
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.size <= 2 * 1024 * 1024) {
            setLogoFile(file);
          } else {
            toast.error('File too large (max 2MB)');
          }
        }}
      />

      <Button
        type="submit"
        className="w-full bg-[#7F5EFD] text-white hover:bg-[#6f4ee0]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Company'}
      </Button>
    </form>
  );
}
