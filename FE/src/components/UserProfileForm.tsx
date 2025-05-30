
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, MapPin, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const userProfileSchema = z.object({
  birthdate: z.date({
    required_error: "생년월일을 선택해주세요.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "성별을 선택해주세요.",
  }),
  location: z.string().min(1, {
    message: "거주지역을 입력해주세요.",
  }),
  interests: z.string().min(1, {
    message: "관심 정책 분야를 입력해주세요.",
  }),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export function UserProfileForm() {
  const navigate = useNavigate();
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      location: "",
      interests: "",
    },
  });

  const onSubmit = (data: UserProfileFormValues) => {
    // Store user profile in localStorage
    localStorage.setItem("userProfile", JSON.stringify(data));
    // Navigate to chat page
    navigate('/chat');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-kakao-brown text-center mb-6">청년정책 AI 상담 프로필</h2>
      <p className="text-gray-600 mb-6 text-center">맞춤형 정책 추천을 위해 기본 정보를 입력해주세요</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-kakao-brown">생년월일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ko })
                        ) : (
                          <span>생년월일을 선택하세요</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1950-01-01")
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-kakao-brown">성별</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">남성</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">여성</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">기타</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-kakao-brown">거주지역</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="예: 서울특별시 강남구" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-kakao-brown">관심 정책 분야</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="관심 분야를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="취업지원">취업지원</SelectItem>
                    <SelectItem value="주거지원">주거지원</SelectItem>
                    <SelectItem value="금융지원">금융지원</SelectItem>
                    <SelectItem value="교육지원">교육지원</SelectItem>
                    <SelectItem value="창업지원">창업지원</SelectItem>
                    <SelectItem value="문화지원">문화지원</SelectItem>
                    <SelectItem value="건강지원">건강지원</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-kakao-yellow text-kakao-brown hover:bg-yellow-400"
          >
            상담 시작하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
