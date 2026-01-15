"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/shared/navigation";
import { GroupLabel } from "@/components/shared/group-label";
import { Image as ImageIcon, Search, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function CreateStoryPage() {
  const [tags, setTags] = useState([
    "#Muslimfriendly",
    "#staycation",
    "#localfood",
  ]);
  const [newTag, setNewTag] = useState("");
  const [agreed, setAgreed] = useState(false);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      if (tags.length >= 3) return; // Constraint from design: max 3 tags
      const formattedTag = newTag.startsWith("#") ? newTag : `#${newTag}`;
      setTags([...tags, formattedTag]);
      setNewTag("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <GroupLabel group={4} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-14 xl:px-[56px] py-12">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-10">
          Create a Community Story
        </h1>

        <div className="space-y-8">
          {/* Share Image Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-800">Share Image</h2>
            <p className="text-sm text-neutral-500">
              Upload and share your amazing travel photo (Maximum only 4 images)
            </p>
            <div className="w-40 h-40 border border-dashed border-neutral-800 rounded-lg flex items-center justify-center bg-white cursor-pointer hover:bg-neutral-50 transition-colors">
              <ImageIcon className="w-16 h-16 text-neutral-400 stroke-1" />
            </div>
          </section>

          {/* Add a title */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-800">Add a title</h2>
            <Input
              placeholder="Write your interesting title"
              className="border-purple-900/50 focus-visible:ring-purple-900 rounded-lg h-12"
            />
          </section>

          {/* Add Location */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-800">Add Location</h2>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  placeholder="Search location"
                  className="pl-10 border-purple-900/50 focus-visible:ring-purple-900 rounded-lg h-12"
                />
              </div>
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold h-12 px-8 rounded-lg">
                Search
              </Button>
            </div>
          </section>

          {/* Tell us about your trip */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-800">Tell us about your trip</h2>
            <div className="relative">
              <Textarea
                placeholder="Share about your trip with maximum 100 words"
                className="min-h-[250px] border-purple-900/50 focus-visible:ring-purple-900 rounded-xl resize-none p-4 text-base"
              />
            </div>
          </section>

          {/* Create Tags */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-800">Create Tags</h2>

            <div className="flex gap-4">
              <Input
                placeholder="Create Tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="max-w-md border-purple-900/50 focus-visible:ring-purple-900 rounded-lg h-12"
              />
              <Button
                onClick={addTag}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold h-12 px-8 rounded-lg"
              >
                Create
              </Button>
            </div>

            <p className="text-sm text-neutral-500">(You can only create 3 tags for each story)</p>

            {/* Tag badges */}
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-700 border border-purple-900/50 rounded-full bg-transparent"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Confirmation & Submit */}
          <section className="space-y-6 pt-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 border border-neutral-400 rounded accent-[#1E3A8A] cursor-pointer"
              />
              <label htmlFor="confirm" className="text-sm text-neutral-500 cursor-pointer select-none">
                I confirm that all photos and videos I have uploaded are my own, and I agree to be bound by Jalan-Jalan's Terms of Service and Community Guidelines.
              </label>
            </div>

            <Button
              disabled={!agreed}
              className="w-full sm:w-auto min-w-[200px] h-12 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}

